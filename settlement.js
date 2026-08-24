window.renderSettlement = function(trip) {
  let map = {};
  trip.members.forEach((m) => (map[m.id] = {
    name: m.name,
    paid: 0,
    owed: 0
  }));
  trip.expenses.forEach((e) => {
    if (map[e.paidBy]) map[e.paidBy].paid += Number(e.amount);
    e.splitAmong.forEach((id) => {
      if (map[id]) map[id].owed += Number(e.amount) / e.splitAmong.length;
    });
  });
  let balances = Object.values(map).map((x) => ({
      ...x,
      balance: x.paid - x.owed,
    })),
    debtors = balances
    .filter((x) => x.balance < -0.01)
    .map((x) => ({
      ...x,
      amount: -x.balance
    })),
    creditors = balances
    .filter((x) => x.balance > 0.01)
    .map((x) => ({
      ...x,
      amount: x.balance
    })),
    settlements = [];
  debtors.forEach((d) =>
    creditors.forEach((c) => {
      let amount = Math.min(d.amount, c.amount);
      if (amount > 0.01) {
        settlements.push(
          `${d.name} should pay ${TripSync.money(amount)} to ${c.name}.`,
        );
        d.amount -= amount;
        c.amount -= amount;
      }
    }),
  );
  return `<div class="module-head"><h2>Settlement</h2></div><div class="panel"><table class="settlement-table"><thead><tr><th>Member</th><th>Total paid</th><th>Total share</th><th>Balance</th></tr></thead><tbody>${balances.map((x) => `<tr><td>${TripSync.esc(x.name)}</td><td>${TripSync.money(x.paid)}</td><td>${TripSync.money(x.owed)}</td><td class="${x.balance >= 0 ? "positive" : "negative"}">${x.balance >= 0 ? "+" : "-"}${TripSync.money(Math.abs(x.balance))}</td></tr>`).join("")}</tbody></table>${settlements.length ? `<div class="settlement-list"><h3>Suggested transfers</h3>${settlements.map((x) => `<div class="settlement-item">${x}</div>`).join("")}</div>` : '<div class="empty-state"><h3>Everyone is square</h3><p>No transfers are needed right now.</p></div>'}</div>`;
};
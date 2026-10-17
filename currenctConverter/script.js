fetch(
  'https://api.restcountries.com/countries/v5?q=canada',
  { headers: { 'Authorization': 'Bearer rc_live_57d2f2498cfe46ef8187bb1869065c64' } }
)
  .then(function (response) { return response.json(); })
  .then(function (data) { console.log(data); });

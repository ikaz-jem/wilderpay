export const formatPrice = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD', // Specify desired currency
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatCustomPrice (price ,decimals = 2) {

let formatPrice = new Intl.NumberFormat('en-US', {
 // Specify desired currency
  minimumFractionDigits: 0,
  maximumFractionDigits: decimals,
});

return formatPrice.format(price)

}
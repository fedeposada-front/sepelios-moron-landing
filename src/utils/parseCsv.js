// RFC 4180-style parser for published Google Sheets CSV (quotes, commas and line breaks).
export function parsePublishedCsv(input) {
  const text = String(input ?? '').replace(/^\uFEFF/, '')
  const rows = []
  let row = [], field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++ }
      else if (!quoted && field === '') quoted = true
      else if (quoted) quoted = false
      else field += ch
    } else if (ch === ',' && !quoted) {
      row.push(field); field = ''
    } else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      if (row.some(value => value !== '')) rows.push(row)
      row = []; field = ''
    } else {
      field += ch
    }
  }
  if (quoted) throw new Error('CSV con comillas sin cerrar')
  row.push(field)
  if (row.some(value => value !== '')) rows.push(row)
  return rows
}

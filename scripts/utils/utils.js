async function getCities(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка. Адрес ${url} не отвечает. Статус: ${response.status}`)
  }
  return await response.json();

}


export default getCities

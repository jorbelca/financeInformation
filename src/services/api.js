const API_KEY = process.env.API_KEY

export const hardData = async (symbol, time) => {
  const url = `https://www.alphavantage.co/query?function=${time}&symbol=${symbol}&apikey=${API_KEY}`
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'request',
        'Content-Type': 'application/json',
      }
    })
    return response
  } catch (error) {
    console.log(error);
    return error
  }


}

export const fundamentals = async (symbol) => {
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'request',
        'Content-Type': 'application/json',
      }
    })
    return response
  } catch (error) {
    console.log(error);
    return error
  }


}







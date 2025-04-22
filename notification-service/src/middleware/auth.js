const auth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  };
  
  export default auth;

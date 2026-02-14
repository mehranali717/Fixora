const sanitizeObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === "object") {
    const next = {};
    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      next[key] = sanitizeObject(child);
    }
    return next;
  }

  return value;
};

const sanitizeRequest = (req, _res, next) => {
  const sanitizedBody = sanitizeObject(req.body);
  const sanitizedQuery = sanitizeObject(req.query);
  const sanitizedParams = sanitizeObject(req.params);

  if (req.body && typeof req.body === "object") {
    Object.keys(req.body).forEach((key) => delete req.body[key]);
    Object.assign(req.body, sanitizedBody);
  }

  if (req.query && typeof req.query === "object") {
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, sanitizedQuery);
  }

  if (req.params && typeof req.params === "object") {
    Object.keys(req.params).forEach((key) => delete req.params[key]);
    Object.assign(req.params, sanitizedParams);
  }

  next();
};

export default sanitizeRequest;

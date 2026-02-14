export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!parsed.success) {
    return next({
      statusCode: 400,
      message: "Validation failed",
      details: parsed.error.flatten(),
    });
  }

  req.validated = parsed.data;
  next();
};

const userRouter = require("./user");
const { notFound, errHandler } = require("../middlewares/errHandler");
const initRouter = (app) => {
  // POST-USER
  app.use("/api/user", userRouter);

  // Cath Error
  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRouter;

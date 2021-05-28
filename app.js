const express = require("express");

const loginRouter = require("./routes/login");

const port = 8426;
const app = express();

app.use(express.json());

app.use("/login", loginRouter);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error \n", err.message);
});

app.listen(port, () => {
  console.log(`Run Server with port number ${port}`);
});

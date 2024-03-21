import express from "express";
import cors from "cors";
import {
  uselogin,
  accesstoken,
  refreshtoken,
  loginsuccess,
  logout,
} from "./app/src/Login/login.ctrl.js";
import restCtrl from "./app/src/restaurants/restaurants.ctrl.js";
import reviewCtrl from "./app/src/Reviews/review.ctrl.js";
import userCtrl from "./app/src/User/user.ctrl.js";

import pkg from "pg";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  password: "qAEltfF1IbsOPMx",
  host: "testebackenddb.internal",
  database: "postgres",
  port: 5432,
});

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// 로그인 처리 엔드포인트
app.post("/api/v1/login", uselogin);
app.get("/api/v1/accesstoken", accesstoken);
app.get("/api/v1/refreshtoken", refreshtoken);
app.get("/api/v1/login/success", loginsuccess);
app.post("/api/v1/logout", logout);

// 예시: get 식당 정보 조회
app.get("/api/v1/restaurants", restCtrl.restrs);

// 예시: 식당 단건 조회
app.get("/api/v1/restaurants/:restaurants_id", restCtrl.restr);

// 예시: 사용자 정보 생성
app.post("/api/v1/users", userCtrl.makeuser);

// 예시: 리뷰 생성
app.post("/api/v1/reviews", reviewCtrl.createreview);

// 예시: 리뷰 수정
app.put("/api/v1/reviews/:review_id", reviewCtrl.remotereview);

// 예시: 리뷰 삭제
app.delete("/api/v1/reviews/:review_id", reviewCtrl.deletereview);

// 예시: 사용자 정보 조회
app.get("/api/v1/users/:user_id", userCtrl.selectuser);

// 예시: 사용자의 리뷰 목록 조회
app.get("/api/v1/users/:user_id/reviews", reviewCtrl.userreview);

// 예시: 특정 식당의 리뷰 목록 조회
app.get("/api/v1/restaurants/:restaurant_id/reviews", reviewCtrl.restreview);

// Hello World! 엔드포인트
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { pool, jwt };

import { pool, jwt } from "../../../app.js"; // JWT 모듈 가져오기

const uselogin = async (req, res) => {
  const { email } = req.body;

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const userInfo = rows[0];

    if (!userInfo) {
      res.status(403).json("Not Authorized");
    } else {
      const accesstoken = jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
        },
        process.env.ACCESS_SECRET,
        { expiresIn: "1m", issuer: "About Tech" }
      );
      const refreshtoken = jwt.sign(
        {
          id: userInfo.id,
          username: userInfo.username,
          email: userInfo.email,
        },
        process.env.REFRECH_SECRET,
        { expiresIn: "24h", issuer: "About Tech" }
      );

      res.cookie("accessToken", accesstoken, {
        secure: false,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshtoken, {
        secure: false,
        httpOnly: true,
      });

      res.status(200).json("login success");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const accesstoken = async (req, res) => {
  // Access Token 관련 처리를 여기에 구현

  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const token = req.cookies.accesstoken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const userData = rows.filter((i) => {
      return i.email === data.email;
    });
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
};

const refreshtoken = async (req, res) => {
  // Refresh Token 관련 처리를 여기에 구현
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const token = req.cookies.refreshToken;
    const data = jwt.verify(token, process.env.REFRECH_SECRET);
    const userData = rows.filter((item) => {
      return item.email === data.email;
    })[0];

    // access Token 새로 발급
    const accessToken = jwt.sign(
      {
        id: userData.id,
        username: userData.username,
        email: userData.email,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "1m",
        issuer: "About Tech",
      }
    );

    res.cookie("accessToken", accessToken, {
      secure: false,
      httpOnly: true,
    });

    res.status(200).json("Access Token Recreated");
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginsuccess = async (req, res) => {
  // 로그인 성공 처리를 여기에 구현
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const token = req.cookies.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const userData = rows.filter((item) => {
      return item.email === data.email;
    })[0];

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json(error);
  }
};

const logout = (req, res) => {
  // 로그아웃 처리를 여기에 구현
  try {
    res.cookie("accessToken", "");
    res.status(200).json("Logout Success");
  } catch (error) {
    res.status(500).json(error);
  }
};

export default { uselogin, accesstoken, refreshtoken, loginsuccess, logout };

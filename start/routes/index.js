import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';

const router = express.Router();

const users = [
  {
    id: 0,
    name: 'root',
    password: 'pass',
    role: 'Admin',
  },
  {
    id: 1,
    name: 'Taro',
    password: 'Taro123',
    role: 'none',
  },
];
// body: { username: 'andre', password: '12345' }でなければ動作しない

// LocalStrategyのコールバック関数は、done()のコールバックを返すようにしていれば実装方法は任意でよく、
// とにかく与えられたIDとパスワードが正しいか（IDがある、パスワードが正しい、など）判断し、done()を返せばいい
passport.use(
  new LocalStrategy((username, password, done) => {
    if (users.find((u) => username === u.name).password === password) {
      return done(null, { username, password });
    }
    return done(null, false);
  })
);

const authorize = (role) => {
  return (request, response, next) => {
    if (
      request.isAuthenticated() &&
      users.find((u) => request.user.username === u.name).role === role
    )
      return next();
    return response.send("couldn't authorize");
  };
};

// 認証が成功すると、セッション内にオブジェクトpassport: { user : obj }を作成する
passport.serializeUser((user, done) => {
  console.log('Serialize ...');
  done(null, user);
});

// httpリクエストがあった際に、セッション内のオブジェクトがundefinedでなければ、
// req.userにオブジェクトを格納しルータに引き渡す
passport.deserializeUser((user, done) => {
  console.log('Deserialize ...');
  done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/', (req, res) => {
  console.log(req.session);
  res.send({ user: req.user });
});
// curl -b 'connect.sid=xxx' http://localhost:3000/

router.get('/failure', (req, res) => {
  console.log(req.session);
  res.send('Failure');
});

router.get('/success', (req, res) => {
  console.log(req.session);
  res.redirect('/');
});

router.post(
  '/',
  passport.authenticate('local', {
    failureRedirect: '/failure',
    successRedirect: '/success',
  })
);
// curl -X POST -d 'username=Taro&password=Taro123' --dump-header - http://localhost:3000/

router.post('/privilege', authorize('none'), (request, response) => {
  response.send('Authorized');
});

router.post('/logout', (req, res) => {
  req.session.passport.user = undefined;
  // req.logout();
  res.redirect('/');
});

export default router;

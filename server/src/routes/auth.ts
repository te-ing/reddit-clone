import Sub from '@/entity/Sub';
import { User } from '@/entity/User';
import Vote from '@/entity/Vote';
import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    // 이메일과 유저이름이 이미 사용중인지 확인
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 이미 있다면 errors 객체에 넣어줌
    if (emailUser) errors.email = '이미 해당 이메일 주소가 사용되었습니다.';
    if (usernameUser) errors.username = '이미 사용중인 이름입니다.';

    // 에러가 있다면 return으로 에러를 반환
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 정해 놓은 조건으로 user 데이터의 유효성 검사를 해줌.
    errors = await validate(user);

    // 유저 정보를 user table에 저장
    await user.save();
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const router = Router();
router.post('/register', register);
router.get('/register', getRegister);

export default router;

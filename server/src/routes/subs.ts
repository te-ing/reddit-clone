import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import authMiddleware from '@/middlewares/auth';
import userMiddleware from '@/middlewares/user';
import Sub from '@/entity/Sub';
import { isEmpty } from 'class-validator';
import { AppDataSource } from '@/data-source';
import { User } from '@/entity/User';
import Post from '@/entity/Post';
import multer, { FileFilterCallback } from 'multer';
import { makeId } from '@/utils/helpers';
import path from 'path';
import { unlinkSync } from 'fs';

const getSub = async (req: Request, res: Response) => {
  const name = req.params.name;
  try {
    const sub = await Sub.findOneByOrFail({ name });
    return res.json(sub);
  } catch (error) {
    return res.status(404).json({ error: '커뮤니티를 찾을 수 없습니다.' });
  }
};

const createSub = async (req: Request, res: Response, next) => {
  const { name, title, description } = req.body;

  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = '이름은 비워둘 수 없습니다.';
    if (isEmpty(title)) errors.title = '제목은 비워둘 수 없습니다.';

    const sub = await AppDataSource.getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = '서브가 이미 존재합니다.';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const user: User = res.locals.user;

    const sub = new Sub();
    sub.name = name;
    sub.description = description;
    sub.title = title;
    sub.user = user;

    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: '문제가 발생했습니다.' });
  }
};

const topSubs = async (req: Request, res: Response) => {
  try {
    const imageUrlExp = `COALESCE(CONCAT('${process.env.APP_URL}/images/', s.imageUrn), 'https://www.gravatar.com/avatar?d=mp&f=y')`;
    const subs = await AppDataSource.createQueryBuilder()
      .select(`s.name, s.title, ${imageUrlExp} as "imageUrl", count(p.id) as "postCount"`)
      .from(Sub, 's')
      .leftJoin(Post, 'p', `s.name = p.subName`)
      .groupBy('s.name, s.title, "imageUrl"')
      .orderBy(`"postCount"`, 'DESC')
      .limit(5)
      .execute();
    return res.json(subs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: '문제가 발생했습니다.' });
  }
};

const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;
  try {
    const sub = await Sub.findOneOrFail({ where: { name: req.params.name } });
    if (sub.username !== user.username) {
      return res.status(403).json({ error: '이 커뮤니티를 소유하고 있지 않습니다.' });
    }

    res.locals.sub = sub;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: '문제가 발생했습니다.' });
  }
};

const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images',
    filename: (_, file, callback) => {
      const name = makeId(10);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(new Error('이미지가 아닙니다'));
    }
  },
});

const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;
    // 파일 유형을 지정하지 않았을 시 업로드 된 파일 삭제
    if (type !== 'image' && type !== 'banner') {
      if (!req.file?.path) {
        return res.status(400).json({ error: '유효하지 않은 파일' });
      }

      // 파일을 지워주기
      unlinkSync(req.file.path);
      return res.status(400).json({ error: '잘못된 유형' });
    }

    let oldImageUrn = '';
    if (type === 'image') {
      // 사용중인 Urn을 저장 (이전 파일을 아래서 삭제하기 위해)
      oldImageUrn = sub.imageUrn || '';
      // 새로운 파일 이름을 Urn 으로 넣어줍니다.
      sub.imageUrn = req.file?.filename || '';
    } else if (type === 'banner') {
      oldImageUrn = sub.bannerUrn || '';
      sub.bannerUrn = req.file?.filename || '';
    }
    await sub.save();

    // 사용하지 않는 이미지 파일 삭제
    if (oldImageUrn !== '') {
      const fullFilename = path.resolve(process.cwd(), 'public', 'images', oldImageUrn);
      unlinkSync(fullFilename);
    }
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: '문제가 발생했습니다.' });
  }
};

const router = Router();

router.post('/', userMiddleware, authMiddleware, createSub);
router.get('/:name', userMiddleware, getSub);
router.get('/sub/topSubs', topSubs);
router.post('/:name/upload', userMiddleware, authMiddleware, ownSub, upload.single('file'), uploadSubImage);

export default router;

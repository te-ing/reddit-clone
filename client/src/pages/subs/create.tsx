import InputGroup from '@/components/InputGroup';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
  name: string;
  title: string;
  description: string;
}

const SubCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
    setError,
  } = useForm<FormValues>();
  let router = useRouter();

  const onSubmit = async ({ name, title, description }: FormValues) => {
    try {
      const res = await axios.post('/subs', { name, title, description });
      router.push(`/r/${res.data}`);
    } catch (error: any) {
      setError('name', { message: error?.response.data.name });
      setError('title', { message: error?.response.data.title });
      setError('description', { message: error?.response.data.description });
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <h1 className="mb-2 text-lg font-medium">커뮤니티 만들기</h1>
        <hr />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-6">
            <p className="font-medium">Name</p>
            <p className="mb-2 text-xs text-gray-400">커뮤니티 이름은 변경할 수 없습니다.</p>
            <input
              id="name"
              className="w-full p-3 text-xs transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white"
              type="text"
              placeholder="이름"
              {...register('name')}
            />
            {errors.name && (
              <small role="alert" className="text-red-500 text-xs">
                {errors.name.message}
              </small>
            )}
          </div>

          <div className="my-6">
            <p className="font-medium">Title</p>
            <label htmlFor="title" className="text-xs mb-2 text-gray-400">
              주제를 나타냅니다. 언제든지 변경할 수 있습니다.
            </label>
            <input
              id="title"
              className="w-full p-3 text-xs transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white"
              type="text"
              placeholder="제목"
              {...register('title')}
            />

            {errors.title && (
              <small role="alert" className="text-red-500 text-xs">
                {errors.title.message}
              </small>
            )}
          </div>

          <div className="my-6">
            <p className="font-medium">Description</p>
            <label htmlFor="description" className="text-xs mb-2 text-gray-400">
              해당 커뮤니티에 대한 설명입니다.
            </label>
            <input
              id="description"
              className="w-full p-3 text-xs transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white"
              type="text"
              placeholder="설명"
              {...register('description')}
            />

            {errors.description && (
              <small role="alert" className="text-red-500 text-xs">
                {errors.description.message}
              </small>
            )}
          </div>

          <div className="flex justify-end">
            <button
              className="px-4 py-1 text-sm font-smibold rounded text-white bg-gray-400 border"
              type="submit"
              disabled={isSubmitting}
            >
              커뮤니티 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCreate;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('Missing auth token cookie');

    // 쿠키가 있다면 백엔드에서 인증처리
    await axios.get('/auth/me', { headers: { cookie } });

    return { props: {} };
  } catch (error) {
    // 307 임시url 이동
    res.writeHead(307, { Location: '/login' }).end();
    return { props: {} };
  }
};

import { useAuthDispatch, useAuthState } from '@/context/auth';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
  username: string;
  password: string;
}

const login = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
    setError,
  } = useForm<FormValues>();
  let router = useRouter();
  const { authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  if (authenticated) router.push('/');

  const handleRegisterSubmit = async ({ password, username }: FormValues) => {
    try {
      const res = await axios.post(
        '/auth/login',
        {
          password,
          username,
        },
        {
          withCredentials: true,
        }
      );
      dispatch('LOGIN', res.data?.user);
      router.push('/');
    } catch (error: any) {
      setError('password', { message: error?.response?.data.password });
      setError('username', { message: error?.response?.data.username });
    }
  };
  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="w-10.12 mx-auto md:w-96">
          <h1 className="text-lg font-medium">로그인</h1>
          <form onSubmit={handleSubmit((data) => handleRegisterSubmit(data))}>
            <div>
              <label htmlFor="username" className="text-xs ">
                유저명
              </label>
              <input
                id="username"
                className="w-full p-3 text-xs transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white"
                type="text"
                placeholder="유저명을 입력하세요"
                aria-invalid={!isDirty ? undefined : errors.username ? 'true' : 'false'}
                {...register('username', { required: '유저명은 필수 입력입니다.' })}
              />
              {errors.username && (
                <small role="alert" className="text-red-500 text-xs">
                  {errors.username.message}
                </small>
              )}
            </div>

            <div>
              <label htmlFor="password" className="text-xs">
                비밀번호
              </label>
              <input
                id="password"
                className="w-full p-3 text-xs transition duration-200 border border-gray-400 rounded bg-gray-50 focus:bg-white hover:bg-white"
                type="password"
                placeholder="비밀번호를 입력하세요"
                aria-invalid={!isDirty ? undefined : errors.password ? 'true' : 'false'}
                {...register('password', {
                  required: '비밀번호는 필수 입력입니다.',
                  minLength: {
                    value: 8,
                    message: '8자리 이상 비밀번호를 사용하세요.',
                  },
                })}
              />
              {errors.password && (
                <small role="alert" className="text-red-500 text-xs">
                  {errors.password.message}
                </small>
              )}
            </div>
            <button
              className="w-full py-2 my-4 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded"
              type="submit"
              disabled={isSubmitting}
            >
              로그인
            </button>
          </form>
          <small>
            등록된 계정이 없으신가요?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">회원가입</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default login;

import { Post } from '@/types';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
interface FormValues {
  title: string;
  body: string;
  sub?: string;
}

const PostCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
    setError,
  } = useForm<FormValues>();
  const router = useRouter();
  const { sub: subName } = router.query;

  const onSubmit = async ({ title, body }: FormValues) => {
    if (!title.trim() || !subName) return;
    try {
      const { data: post } = await axios.post<Post>('/posts', {
        title: title.trim(),
        body,
        sub: subName,
      });
      console.log(title, body, subName);
      router.push(`/r/${subName}/${post.identifier}/${post.slug}`);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <div className="p-4 bg-white rounded">
          <h1 className="mb-3 text-lg">포스트 생성하기</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative mb-2">
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="제목"
                maxLength={20}
                {...register('title')}
              />
              <div style={{ top: 10, right: 10 }} className="absolute mb-2 text-sm text-gray-400 select-nont">
                / 20
              </div>
            </div>

            <textarea
              id={'body'}
              rows={4}
              placeholder="설명"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              {...register('body')}
            />
            <div className="flex justify-end">
              <button className="px-4 py-1 text-sm font-semibold text-white bg-gray-400 border rounded">
                생성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCreate;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('쿠키가 존재하지 않습니다.');

    await axios.get('/auth/me', { headers: { cookie } });
    return { props: {} };
  } catch (error) {
    res.writeHead(307, { Location: '/login' }).end();
    return { props: {} };
  }
};

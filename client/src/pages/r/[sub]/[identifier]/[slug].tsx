import { useAuthState } from '@/context/auth';
import { Post } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface FormValues {
  newComment: string;
}

const PostPage = () => {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  const { authenticated, user } = useAuthState();
  const { data: post, error } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormValues>();

  const isNotEmpty = (value: string) => value.trim() !== '';
  const onSubmit = async ({ newComment }: FormValues) => {
    try {
      await axios.post(`/posts/${post?.identifier}/${post?.slug}/comments`, {
        body: newComment,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex max-w-5xl px-44 pt-5 mx-auto">
      <div className="w-full md:mr-3 md:w-8/12">
        <div className="bg-white rounded">
          {post && (
            <>
              <div className="flex">
                <div className="py-2 pr-2">
                  <div className="flex items-center">
                    <p className="text-xs test-gray-400">
                      Posted by
                      <Link href={`/u/${post.username}`}>
                        <a className="mx-1 hover:underline">/u/{post.username}</a>
                      </Link>
                      <Link href={post.url}>
                        <a className="mx-1 hover:underline">{dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}</a>
                      </Link>
                    </p>
                  </div>
                  <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                  <p className="my-3 text-sm">{post.body}</p>
                  <div className="flex">
                    <button className="flex items-center">
                      <i className="material-symbols-outlined mr-1">chat_bubble</i>
                      <span className="font-bold">{post.commentCount} Comments</span>
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {/* 댓글 작성 구간 */}
                <div className="pr-6 mb-4">
                  {authenticated ? (
                    <div>
                      <p className="mb-1 text-xs">
                        <Link href={`/u/${user?.username}`}>
                          <a className="font-semibold text-blue-500">{user?.username}</a>
                        </Link>{' '}
                        으로 댓글 작성
                      </p>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                          style={{ resize: 'none' }}
                          {...register('newComment', { required: true, validate: isNotEmpty })}
                        ></textarea>
                        <div className="flex justify-end">
                          <button
                            className="px-3 py-1 text-white bg-gray-400 rounded"
                            disabled={isSubmitting || !isValid}
                          >
                            댓글 작성
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                      <p className='"font-semibold text-gray-400'>댓글 작성을 위해서 로그인 해주세요.</p>
                      <div>
                        <Link href={`/login`}>
                          <a className="px-3 py-1 text-white bg-gray-400 rounded">로그인</a>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;

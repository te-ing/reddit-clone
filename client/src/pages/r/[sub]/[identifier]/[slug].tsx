import { Post } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import useSWR from 'swr';

const PostPage = () => {
  const router = useRouter();
  const { identifier, sub, slug } = router.query;
  console.log(router);

  const { data: post, error } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null);

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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;

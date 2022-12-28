import { Sub } from '@/types';
import axios from 'axios';
import type { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';

const Home: NextPage = () => {
  const fetcher = async (url: string) => {
    return await axios.get(url).then(({ data }) => data);
  };
  const address = `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/subs/sub/topSubs`;
  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);
  console.log('topSubs', topSubs);

  return (
    <div className="flex max-w-5xl px-4 pt-5 mx-auto">
      {/* 포스트 리스트 */}
      <div className="w-full md:mr-3 md:w-8/12"> </div>
      {/* 사이드바 */}
      <div className="hidden w-4/12 ml-3 md:block">
        <div className="bg-white border rounded">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
          </div>

          {/* 커뮤니티 리스트 */}
          <div></div>
          <div className="w-full py-6 text-center">
            <Link href="/subs/create">
              <a className="w-full p-2 text-center text-white bg-gray-400 rounded">커뮤니티 만들기</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

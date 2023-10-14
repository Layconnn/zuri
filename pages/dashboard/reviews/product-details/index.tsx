import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import empty from '../../../../public/assets/reviews/Table.png';
import Container from '@modules/auth/component/Container/Container';
import MainLayout from '../../../../components/Layout/MainLayout';
import RatingCard from '@modules/dashboard/component/reviews/review-page/RatingCard';
import RatingBar from '@modules/dashboard/component/reviews/review-page/RatingBar';
import SellerReview from '@modules/dashboard/component/reviews/review-page/SellersReview';
import Filter from '@modules/dashboard/component/reviews/review-page/ReviewFilter';
import PaginationBar from '../../../../modules/dashboard/component/order/PaginationBar';
import { ratingData, reviewData } from '../../../../db/reviews';
import { ParsedUrlQuery } from 'querystring';
import { NextPage } from 'next';

interface ReviewData {
  productId: string;
  reviewId: string;
  customerName: string;
  isHelpful: number;
  title: string;
  description: string;
  rating: number;
  reply: {
    replyId: string;
    name: string;
    message: string;
    createdAt: string;
  };
  createdAt: string;
}

interface ReviewApiResponse {
  data: ReviewData[];
}

interface Params extends ParsedUrlQuery {
  id: string;
}

const UserReview: NextPage = () => {
  const [data, setData] = useState<ReviewData[] | null>(null);
  const [filteredData, setFilteredData] = useState<ReviewData[] | null>(null);
  const [total5Star, setTotal5Star] = useState<number>(0);
  const [total4Star, setTotal4Star] = useState<number>(0);
  const [total3Star, setTotal3Star] = useState<number>(0);
  const [total2Star, setTotal2Star] = useState<number>(0);
  const [total1Star, setTotal1Star] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    fetch(`https://team-liquid-repo.onrender.com/api/review/shop/1/reviews?pageNumber=0&pageSize=10`)
      .then((res) => res.json())
      .then((data: ReviewApiResponse) => setData(data.data));
  }, []);

  useEffect(() => {
    if (data) {
      const total5 = data.filter((review) => review.rating === 5).length;
      const total4 = data.filter((review) => review.rating === 4).length;
      const total3 = data.filter((review) => review.rating === 3).length;
      const total2 = data.filter((review) => review.rating === 2).length;
      const total1 = data.filter((review) => review.rating === 1).length;
      setTotal5Star(total5);
      setTotal4Star(total4);
      setTotal3Star(total3);
      setTotal2Star(total2);
      setTotal1Star(total1);
    }
  }, [data]);

  function filterReviews(view: string, rating: string, data: ReviewData[]) {
    let filteredReviews: ReviewData[] = [];
    if (rating === 'all') {
      filteredReviews = data;
    } else {
      filteredReviews = data.filter((review) => review.rating === parseInt(rating));
    }

    if (view === 'topReviews') {
      filteredReviews.sort((a, b) => b.isHelpful - a.isHelpful);
    } else if (view === 'newest') {
      filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (view === 'oldest') {
      filteredReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return filteredReviews;
  }

  function handleFilter(view: string, rating: string) {
    if (data !== null && data !== undefined) {
      const filteredReviews = filterReviews(view, rating, data);
      setFilteredData(filteredReviews); // update the filteredData state with the filtered reviews
    }
  }
  return (
    <MainLayout activePage="Explore" showDashboardSidebar={false} showTopbar={true}>
      <Container>
        <div className="flex flex-col">
          <div className=" flex items-center justify-center">
            <div className="flex flex-col w-[89%] mb-10 items-center justify-center">
              <div className="flex justify-start items-center w-full">
                <div className="flex flex-row justify-start items-center cursor-pointer" onClick={() => router.back()}>
                  <Image src="/assets/reviews/return-icon.svg" width={22} height={22} alt="return" />
                  <p className=" m-0 ml-1">The Complete Ruby on Rails Developer Course</p>
                </div>
              </div>
              {reviewData.length === 0 ? (
                <div className="container md:h-[60vh] lg:h-[60vh] xl:h-[70vh] h-[50vh] content-center justify-center flex flex-col mx-auto">
                  <div className="flex flex-col items-center justify-center">
                    <Image src={empty} width={157} height={157} alt="empty" />
                    <p className="lg:text-[28px] lg:leading-9 font-semibold font-manrope md:text-2xl text-base">
                      There are no reviews yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row lg:gap-16 md:gap-10 gap-4 mt-4">
                  <div className="flex flex-row md:flex-col gap-4 md:gap-8 lg:w-80 md:w-48">
                    <RatingBar avgRating={4.2} />
                    <div>
                      {ratingData.map((data, index) => (
                        <RatingCard key={index} rating={data.rating} users={data.users} />
                      ))}
                    </div>
                  </div>
                  <div className="= flex flex-col ml-10">
                    <div className="w-max">
                      <Filter review={4} rating={4} filterReview={(view, rating) => handleFilter(view, rating)} />
                    </div>
                    <div className="mt-6 ">
                      {reviewData.map((data, index) => (
                        <SellerReview
                          reviewId={''}
                          key={index}
                          buyerName={data.buyerName}
                          adminDate={data.adminDate}
                          mainDate={data.adminDate}
                          review={data.review}
                          noOfStars={data.noOfStars}
                          shopReply={data.shopReply}
                          shopName={data.shopName}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <PaginationBar pageLength={1} currentPage={0} changeCurrentPage={() => 1} />
        </div>
      </Container>
    </MainLayout>
  );
};

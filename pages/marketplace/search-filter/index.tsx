import ProductCard from '@modules/marketplace/component/ProductCard';
import styles from '../../../modules/marketplace/component/landingpage/productCardWrapper/product-card-wrapper.module.css';
import Link from 'next/link';
import Error from '@modules/marketplace/component/landingpageerror/ErrorPage';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import { ProductList } from '@modules/marketplace/types/filter-types';
import CategoryLayout from '@modules/marketplace/component/layout/category-layout';
import { Fragment } from 'react';
import { constructApiUrl } from '@modules/marketplace/component/filter/helper';

interface Props {
  products: ProductList[];
}

export default function Index({ products }: Props) {
  return (
    <Fragment>
      {Array.isArray(products) && products?.length === 0 ? (
        <Error />
      ) : (
        <CategoryLayout>
          <div className="max-w-[1240px] mx-auto"></div>
          <div className="px-4 max-w-[1240px] mx-auto">
            <h1 className="text-custom-color31 font-manropeL mt-5 lg:pt-5 md:mb-1 font-bold md:text-2xl leading-normal flex items-center justify-between">
              Search Result for Products
            </h1>
            <div
              className={`flex py-8 flex-nowrap lg:flex-wrap gap-y-[70px] mb-[74px] w-full overflow-scroll ${styles['hide-scroll']}`}
            >
              {products?.map((item: ProductList) => {
                return (
                  <Link
                    href={`marketplace/product-details?id=${item.id}`}
                    key={item.id}
                    className="relative w-1/2 md:w-1/3 lg:w-1/4 pr-2 md:pr-4 lg:pr-8"
                  >
                    <ProductCard
                      id={item.id}
                      currency={`USD`}
                      image={item.images[0].url || `/assets/products-banner/Image-11.png`}
                      name={item?.name}
                      price={parseInt(item.price)}
                      user={item?.shop.name ? item?.shop.name : ``}
                      rating={item.rating || 0}
                      showLimitedOffer={false}
                      showTopPicks={false}
                      showDiscount={true}
                      discount_price={50}
                      shop={item.shop}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </CategoryLayout>
      )}
    </Fragment>
  );
}

export const getServerSideProps = (async (context) => {
  let category = context.query.category as string;
  let subCategory = context.query.subCategory as string;
  let price = !isNaN(parseInt(context.query.price as string)) ?  context.query.price as string : '';
  let discount = !isNaN(parseInt(context.query.discount as string)) ?  context.query.discount as string : '';
  let rating = context.query.rating as string;
  const queryParams = { category, subCategory, price, discount, rating};
  let apiUrl = constructApiUrl('https://coral-app-8bk8j.ondigitalocean.app/api/products-filter', queryParams);
  const { data, status } = await axios.get<{ products: ProductList[] }>(apiUrl.toString());
  if (status === 400 || status === 500) {
    console.error('Bad request');
  }

  const res = data.products ? data.products : [];
  return { props: { products: res } };
}) satisfies GetServerSideProps<{
  products: ProductList[];
}>;

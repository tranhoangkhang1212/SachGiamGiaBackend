import { ProductFilter } from 'src/constant/enum/product-filter';

export const filterDataConstants = [
  {
    title: 'Thể loại',
    type: ProductFilter.Category,
  },
  {
    title: 'Tác giả',
    type: ProductFilter.Author,
  },
  {
    title: 'Nhà phát hành',
    type: ProductFilter.Publisher,
  },
];

export const priceValuesFilter = {
  1: '10000-20000',
  2: '20000-30000',
  3: '30000-40000',
  4: '40000-50000',
  5: '50000-60000',
};

const priceValuesData = Object.keys(priceValuesFilter).map((id) => ({ id, name: priceValuesFilter[id] }));

export const priceFilters = { title: 'Giá tiền', type: ProductFilter.Price, values: priceValuesData };

export type TSortType = 'DESC' | 'ASC';

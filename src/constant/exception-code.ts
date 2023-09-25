export interface IExceptionMsg {
  code: number;
  message: string;
}

export type TErrorKey =
  | 'DEFAULT_ERROR_MESSAGE'
  | 'USER_ALREADY_EXISTS'
  | 'CATEGORY_NAME_ALREADY_EXISTS'
  | 'PRODUCT_NAME_ALREADY_EXISTS'
  | 'SIDE_BAR_NAME_ALREADY_EXISTS'
  | 'SIDE_BAR_ARE_NOT_SUB_MENU'
  | 'SIDE_BAR_NOT_FOUND'
  | 'SIDE_BAR_SUB_MENU_NOT_FOUND'
  | 'DISTRIBUTOR_NAME_ALREADY_EXISTS'
  | 'CREATE_MULTIPLE_PRODUCTS_ERROR';

export const ExceptionCode: Record<TErrorKey, IExceptionMsg> = {
  DEFAULT_ERROR_MESSAGE: {
    code: 1000,
    message: 'Default error message',
  },
  USER_ALREADY_EXISTS: {
    code: 1001,
    message: 'User name already exists',
  },
  CATEGORY_NAME_ALREADY_EXISTS: {
    code: 1002,
    message: 'Category name already exists',
  },
  PRODUCT_NAME_ALREADY_EXISTS: {
    code: 1003,
    message: 'Product name already exists',
  },
  SIDE_BAR_NAME_ALREADY_EXISTS: {
    code: 1004,
    message: 'Sidebar name already exists',
  },
  SIDE_BAR_ARE_NOT_SUB_MENU: {
    code: 1005,
    message: 'Sidebar are not submenu',
  },
  SIDE_BAR_NOT_FOUND: {
    code: 1006,
    message: 'Sidebar not found',
  },
  DISTRIBUTOR_NAME_ALREADY_EXISTS: {
    code: 1007,
    message: 'Distributor name already exists',
  },
  SIDE_BAR_SUB_MENU_NOT_FOUND: {
    code: 1008,
    message: 'Sidebar Submenu not found',
  },
  CREATE_MULTIPLE_PRODUCTS_ERROR: {
    code: 1009,
    message: 'Create multiple products error',
  },
};

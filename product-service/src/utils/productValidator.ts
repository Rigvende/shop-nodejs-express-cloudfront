import { ID_REGEX } from '../constants/regexp';

interface IProduct {
  title: string;
  description: string;
  price: number;
  url?: string;
  count: number;
}

export const validateProduct = (product: IProduct) => {

  const productProps: {
    [key: string]: {
      type: string;
      required: boolean;
      quantityCheck?: boolean;
      validator?: (prop: any) => boolean
    }
  } = {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    price: {
      type: 'number',
      quantityCheck: true,
      required: true,
    },
    count: {
      type: 'number',
      quantityCheck: true,
      required: true,
    },
    url: {
      type: 'string',
      required: false,
    }
  };

  const validationErrors = [];

  for (let [key, validationProps] of Object.entries(productProps)) {
    const { type, required, quantityCheck, validator } = validationProps;
    const incomingValue = product[key];

    if (!incomingValue) {
      if (required) {
        validationErrors.push(key);
      }
      continue;
    }

    if (typeof incomingValue !== type) {
      validationErrors.push(key);
      continue;
    }

    if (quantityCheck) {
      if (incomingValue < 0) {
        validationErrors.push(key);
        continue;
      }
    }

    if (validator) {
      if (!validator(incomingValue)) {
        validationErrors.push(key);
        continue;
      }
    }
  }

  return validationErrors;
};

export const isValidId = (id: string) => ID_REGEX.test(id);

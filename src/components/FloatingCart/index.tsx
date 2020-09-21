import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    //pega o valor
    const total = products.reduce((accumulator, product) => {
      //multiplica o os preço com a quantidade
      const productsSubtotal = product.price * product.quantity;
      //adicionar o acumaldor com o subtotal
      return accumulator + productsSubtotal;
      //passa o valor inicial como zero
    }, 0);

    return formatValue(total);
  }, [products]);

  const totalItensInCart = useMemo(() => {
      const total = products.reduce((accumulator, product) => {
        //Retorna a quantidade
        const productsQuantity = product.quantity;
        //adicionar o acumaldor com a quantidade
        return accumulator + productsQuantity;
        //passa o valor inicial como zero
      }, 0);

    return total;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;

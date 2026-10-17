import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import ProductImage from './ProductImage';
import { list, money } from '../api';
import { useStore } from '../context/Store';

export default function ProductCard({ product }) {
  const { addToCart, favorites, toggleFavorite } = useStore();
  const fav = favorites.includes(product.id);
  const colors = list(product.colors);
  const storages = list(product.storages);
  const out = product.stock <= 0;

  return (
    <article className="card">
      <button
        className={`card-fav ${fav ? 'on' : ''}`}
        onClick={() => toggleFavorite(product.id)}
        aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
      </button>
      <Link to={`/produit/${product.id}`} className="card-link">
        <div className="card-media"><ProductImage product={product} /></div>
        <h3>{product.name}</h3>
        <div className="card-price">
          {money(product.price)}
          {product.old_price && <s>{money(product.old_price)}</s>}
        </div>
        <div className="stars"><Star size={13} fill="currentColor" /> {Number(product.rating).toFixed(1)}
          <span>({product.reviews_count})</span></div>
      </Link>
      <button
        className="card-cart"
        disabled={out}
        title={out ? 'Rupture de stock' : 'Ajouter au panier'}
        aria-label="Ajouter au panier"
        onClick={() => addToCart(product, { color: colors[0], storage: storages[0] })}
      >
        <ShoppingCart size={16} />
      </button>
    </article>
  );
}

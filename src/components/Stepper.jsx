export default function Stepper({ current, labels = ['Panier', 'Livraison', 'Paiement'] }) {
  return (
    <ol className="stepper">
      {labels.map((l, i) => (
        <li key={l} className={i + 1 === current ? 'on' : i + 1 < current ? 'done' : ''}>
          <span>{i + 1 < current ? '✓' : i + 1}</span>
          <em>{l}</em>
        </li>
      ))}
    </ol>
  );
}

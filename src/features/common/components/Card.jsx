import '../styles/Card.css';

/**
 * Reusable Card component
 * @param {Object} props
 * @param {'default'|'elevated'|'outlined'} variant
 */
function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  ...rest
}) {
  const classes = ['card', `card-${variant}`, onClick ? 'card-clickable' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} {...rest}>
      {children}
    </div>
  );
}

function CardImage({ src, alt, className = '' }) {
  return (
    <div className={`card-image-wrapper ${className}`}>
      <img src={src} alt={alt} className="card-image" loading="lazy" />
    </div>
  );
}

function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }) {
  return <div className={`card-footer ${className}`}>{children}</div>;
}

Card.Image = CardImage;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;

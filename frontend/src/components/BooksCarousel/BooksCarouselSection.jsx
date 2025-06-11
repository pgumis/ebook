// BooksCarouselSection.jsx (wersja uproszczona)

import Slider from "react-slick";
import Book from "../BooksList/Book/Book";
import "./BooksCarouselSection.css";

const BooksCarouselSection = ({ title, books, loading }) => {
    if (loading) return <p>Ładowanie {title.toLowerCase()}...</p>;
    if (!books || books.length === 0 || books.every(book => book === null)) return null;

    const settings = {
        dots: false,
        infinite: books.length > 6, // Karuzela zapętla się tylko, gdy jest więcej slajdów niż widać
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        responsive: [
            { breakpoint: 1400, settings: { slidesToShow: 5 } },
            { breakpoint: 1200, settings: { slidesToShow: 4 } },
            { breakpoint: 992, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 576, settings: { slidesToShow: 1 } },
        ]
    };

    return (
        <section className="carousel-section">
            <h2>{title}</h2>
            <Slider {...settings}>
                {books.map(book =>
                    book ? (
                        <div key={book.id} className="carousel-slide">
                            <Book bookObj={book} />
                        </div>
                    ) : null
                )}
            </Slider>
        </section>
    );
};

export default BooksCarouselSection;
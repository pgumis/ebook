import Slider from "react-slick";
import Book from "../BooksList/Book/Book";
import "./BooksCarouselSection.css";

const BooksCarouselSection = ({ title, books, loading }) => {
    if (loading) return <p>Ładowanie {title.toLowerCase()}...</p>;
    if (!books || books.length === 0 || books.every(book => book === null)) return null;

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [


            {
                breakpoint: 1200, // do 1200px
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 900, // do 900px
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 600, // do 600px
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <section className="carousel-section">
            <h2>{title}</h2>
            <Slider {...settings}>
                {books.map(book =>
                    book ? (
                        <div key={book.id} className="carousel-slide">
                            <div
                                onMouseDown={(e) => e.currentTarget.dragStartX = e.clientX}
                                onMouseUp={(e) => {
                                    if (Math.abs(e.currentTarget.dragStartX - e.clientX) < 5) {
                                        // traktujemy to jako kliknięcie
                                        e.currentTarget.querySelector('.book-clickable')?.click();
                                    }
                                }}
                            >
                                <Book bookObj={book} />
                            </div>
                        </div>
                    ) : null
                )}
            </Slider>
        </section>
    );
};

export default BooksCarouselSection;

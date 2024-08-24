import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import api from "./api"
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm'


export default () => {
    function handleCardClick(card) {
        setSelectedCard(card);
    }
    
    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api
            .changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => console.log(err));
    }
    
    function handleCardDelete(card) {
        api
            .removeCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => console.log(err));
    }
    
    function closeAllPopups() {        
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
      }

    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);
    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        api
            .getAppInfo()
            .then(([cardData]) => {
                setCards(cardData);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="page__content">
            <section className="places page__section">
                <ul className="places__list">
                    {cards.map((card) => (
                        <Card
                            key={card._id}
                            card={card}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />
                    ))}
                </ul>
            </section>
            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onAddPlace={handleAddPlaceSubmit}
                onClose={closeAllPopups}
            />
            <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        </div>
    )
}
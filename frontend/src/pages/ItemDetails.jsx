import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCurrentItem, saveItem } from '../actions/ItemActions';
import { addToWishList, removeFromWishList } from '../actions/UserActions'
import { addToCart } from '../actions/OrderActions'
import OrderService from '../services/OrderService';
import ReviewList from '../cmps/reviews/ReviewList';
import InnerNavBar from '../cmps/InnerNavBar';

import ReviewRating from '../cmps/reviews/ReviewRating'
import Avatar from '@material-ui/core/Avatar';
import Modal from '../cmps/Modal'
import heart from '../styles/assets/imgs/icons/002-heart.png';
import heartfilled from '../styles/assets/imgs/icons/003-heart-1.png';
import TextField from '@material-ui/core/TextField';

import ItemList from '../cmps/items/ItemList'
import UserService from '../services/UserService';


class ItemDetails extends Component {

    state = {
        imgIndex: 0,
        selectedSize: '',
        reviewMode: false,
        review: {
            title: '',
            txt: '',
            rating: ''
        },
        modalMsg: "",
        wishListStatus: heart,
        recentlyViewd: '',
        date: '',
        size: ''

    }



    componentDidMount() {
        this.loadItems()
    }



    loadItems = async () => {
        await this.props.setCurrentItem(this.props.match.params.id)
        this.setRecentlyViewd()
        this.setWishListStatus()
        this.setDeliveryDate()

    }

    setWishListStatus = () => {
        const { wishlist } = this.props.loggedInUser
        const { item } = this.props;
        // if (item===null) return
        const { _id } = item;

        const isFound = !!wishlist.find(_item => _item._id === _id);
        const wishListStatus = (isFound) ? heartfilled : heart;

        this.setState({ wishListStatus })
    }




    componentDidUpdate(prevProps) {
        // (this.props.match.params.id===state.item.selectedItem._id)?
        if (prevProps.match.params.id !== this.props.match.params.id) this.loadItems()

    }

    componentWillUnmount = () => {
        UserService.updateRecentlyViewd('recently', this.props.item)
        this.props.setCurrentItem(null)
    }

    onBack = () => {
        this.props.history.push('/')
    }

    setMainImg = (imgIndex) => {
        this.setState({ imgIndex })
    }
    changeImg = async (diff) => {
        let currIdx = await this.state.imgIndex

        const newIdx = ((currIdx === 2) && (diff > 0)) ? 0 :
            ((currIdx === 0) && (diff < 0)) ? 2 : (currIdx + diff)
        this.setState({ imgIndex: newIdx })
    }

    onAddToCart = async () => {
        OrderService.addItemtoCart(this.props.item)
        this.props.addToCart()
        await this.setState({ modalMode: true, modalMsg: "Added To Cart" })
        this.setState({ modalMode: false, modalMsg: "" })

    }

    onBuyNow = async () => {
        await OrderService.addItemtoCart(this.props.item)
        this.props.addToCart()
        this.props.history.push('/cart')
    }


    onAddToWishList = async () => {

        if (this.state.wishListStatus === heart) {
            await this.props.addToWishList(this.props.item, this.props.loggedInUser)
            await this.setState({ modalMsg: "Added to Wishlist", wishListStatus: heartfilled })
            await this.setState({ modalMsg: "" })


        }
        else {
            await this.props.removeFromWishList(this.props.item._id, this.props.loggedInUser)
            await this.setState({ modalMsg: "Removed from Wishlist", wishListStatus: heart })
            await this.setState({ modalMsg: "" })
        }


    }

    onAddReview = async () => {
        await this.setState({ reviewMode: true })

    }

    handleSubmit = async (ev) => {
        ev.preventDefault()
        this.setState({ reviewMode: false, review: { txt: '', rate: '' } })
        const itemToUpdate = { ...this.props.item }
        const newReview = { byUser: { id: this.props.loggedInUser._id, name: this.props.loggedInUser.fullName, imgUrl: this.props.loggedInUser.imgUrl }, title: this.state.review.title, txt: this.state.review.txt, rate: this.state.review.rating }
        const reviews = await [...itemToUpdate.reviews, newReview]
        const updatedItem = { ...itemToUpdate, reviews }
        await this.props.saveItem(updatedItem)
        this.props.setCurrentItem(this.props.match.params.id)
        await this.setState({ modalMsg: "Thank you for your review" })
        this.setState({ modalMsg: "" })
    }





    handleInput = (ev) => {

        const value = ev.target.value;
        const field = ev.target.name
        this.setState(prevState => ({ review: { ...prevState.review, [field]: value } }))

    }

    calculateAvgRating = () => {
        const { reviews } = this.props.item
        const ratingSum = reviews.reduce((acc, review) => {

            return acc += +review.rate
        }, 0)
        const avgRating = Math.floor(ratingSum / reviews.length / 5 * 100)
        return avgRating

    }


    setRecentlyViewd = async () => {
        const recentlyViewd = await UserService.getRecntlyViewd()
        this.setState({ recentlyViewd })


    }

    handleSizeSelect = (ev) => {
        let size = ev.target.value
        this.setState({ size })
    }

    setDeliveryDate = () => {

        let today = new Date(Date.now() + 12096e5)
        var dd = today.getDate()
        var mm = today.getMonth() + 1; //As January is 0.
        var yy = today.getFullYear();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;
        let date = dd + '/' + mm + '/' + yy
        this.setState({ date })
    }


    render() {
        const { item } = this.props
        const recentlyViewd = this.state.recentlyViewd
        return (
            item &&
            <React.Fragment>
                <InnerNavBar className="InnerNavBar" ></InnerNavBar>

                <Modal msg={this.state.modalMsg}></Modal>

                <section className="container flex item-details-main">

                    <div className="item-img flex">
                        <div className="item-secondary-image flex column">
                            <img className="secondary-img" onClick={() => this.setMainImg(0)} src={item.imgs[0]} alt="itemImg1" />
                            <img className="secondary-img" onClick={() => this.setMainImg(1)} src={item.imgs[1]} alt="itemImg2" />
                            <img className="secondary-img" onClick={() => this.setMainImg(2)} src={item.imgs[2]} alt="itemImg3" />
                        </div>
                        <div className="item-main-image flex">
                            <div className="ribbon"><span>SALE</span></div>
                            <a onClick={() => this.changeImg(-1)} href="#" className="previous-img">&laquo;</a>
                            <a onClick={() => this.changeImg(1)} href="#" className="next-img">&raquo;</a>
                            <img className="main-img" src={item.imgs[this.state.imgIndex]} alt="mainImg" />
                            <img className="wishlist-icon" onClick={this.onAddToWishList} src={`${this.state.wishListStatus}`}></img>
                        </div>
                    </div>
                    <div className="item-side-details flex column justify-space-between">

                        <div className="container item-shop-details-container">
                            <Link to={`/shop/${item.itemOwner.id}`}>
                                <div className="store-details flex ">
                                    <Avatar alt="" src={item.itemOwner.logoUrl} style={{ backgroundColor: "lightgray" }} />
                                    <h4 className="brand-name"> {item.itemOwner.name}</h4>
                                    {/* <img style={{ height: "80px", width: "80px" }} src={item.itemOwner.logoUrl} alt="brandImg" /> */}
                                </div>
                            </Link>

                            <h1 className="item-details-title">{item.title}</h1>
                                <div className="flex justify-space-between">
                                    <div className="item-price flex">
                                        ${Number.parseFloat(item.price).toFixed(2)}
                                        <div className="was-price">
                                            ${Number.parseFloat(Math.floor(item.price / 0.9)).toFixed(2)}</div>
                                        {/* <div className="discount">-10%</div> */}
                                    </div>
                                    <ReviewRating amount={item.reviews.length} rate={this.calculateAvgRating()}></ReviewRating>
                                </div>
                            
                        </div>

                        <h3 className="item-description">
                                <p>{item.description}</p>
                                <h5>{item.sizeFit}</h5>

                            </h3>

                        <div className="size-select">
                            <button className="item-sizes" id="btn-s" value="S" onClick={this.handleSizeSelect}>S</button>
                            <button className="item-sizes" id="btn-m" value="M" onClick={this.handleSizeSelect}>M</button>
                            <button className="item-sizes" id="btn-l" value="L" onClick={this.handleSizeSelect}>L</button>
                            <button className="item-sizes size-xl" id="btn-xl" value="XL" onClick={this.handleSizeSelect}>XL</button>
                        </div>


                        <div className="item-buttons flex">
                            <button className="btn1" onClick={this.onBuyNow}>Buy Now</button>
                            <button className="btn2 add-to-cart" onClick={this.onAddToCart}>Add to cart</button>
                        </div>
                        <div className="general-information">
                            <div className="buyer-protection flex">
                                <div>35-Day Buyer Protection </div>
                            </div>
                            <div className="free-shipping flex">
                                <div>Free Shipping - Get it at: <span className="delivery-date">{this.state.date}</span></div>
                            </div>
                            
                        </div>
                    </div>
                </section>

                <div className="container reviews ">
                    {/* ////coral//// */}
                    <div className="reviews-items">
                        {item.reviews.length > 0 &&
                            <div className="container">
                                <ReviewList item={this.props.item}></ReviewList>
                            </div>
                            || "No Reviews yet...be the first!"}

                    </div>
                    {!this.state.reviewMode &&
                        <button className="btn1" onClick={this.onAddReview}>Add Review</button>}
                    {this.state.reviewMode &&
                        <form className="review-section flex column justify-space-between" onSubmit={this.handleSubmit}>
                            <div onChange={this.handleInput} className="review-input flex column justify-space-between">

                                <TextField style={{ marginBottom: "20px" }} name="title" required id="standard-required" label="Title" />
                                <TextField id="outlined-multiline-static"
                                    label="Multiline"
                                    multiline
                                    rows="4"
                                    variant="outlined" name="txt" required id="standard-required" label="Review" />
                            </div>
                            <fieldset className="rating" onChange={this.handleInput} >

                                <input type="radio" id="star5" name="rating" value="5" /><label htmlFor="star5" title="Rocks!">5 stars</label>
                                <input type="radio" id="star4" name="rating" value="4" /><label htmlFor="star4" title="Pretty good">4 stars</label>
                                <input type="radio" id="star3" name="rating" value="3" /><label htmlFor="star3" title="Meh">3 stars</label>
                                <input type="radio" id="star2" name="rating" value="2" /><label htmlFor="star2" title="Kinda bad">2 stars</label>
                                <input type="radio" id="star1" name="rating" value="1" /><label htmlFor="star1" title="Sucks big time">1 star</label>
                            </fieldset>
                            <button>Submit</button>
                        </form>}
                </div>

                {/* } */}
                {/* <section className="container">
                    <div>You may also like</div>
                </section> */}
                <section className="container recently-viewed">
                    <h2>Recently viewed</h2>
                    {(recentlyViewd.length > 0) ? <ItemList items={recentlyViewd}></ItemList> : ''

                    }
                </section>
            </React.Fragment >
        )
    }

}

const mapStateToProps = (state) => {

    return {
        item: state.item.selectedItem,
        loggedInUser: state.user.loggedInUser
    };
};

const mapDispatchToProps = {
    setCurrentItem,
    addToWishList,
    removeFromWishList,
    saveItem,
    addToCart
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemDetails);

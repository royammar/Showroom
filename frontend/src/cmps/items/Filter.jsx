import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { setFilters, removeFilter, setSorts } from '../../actions/ItemActions'
// import InputRange from 'react-input-range';
import { loadItems } from '../../actions/ItemActions'
import { removeFromWishList } from '../../actions/UserActions';


class Filter extends Component {
  state = {
    isToggleSize: '',
    isToggleGender: '',
    isToggleShop: '',
    isTogglePrice: 'hide',
    priceValue: 0
  }

  onSelectFilter = (ev) => {
    console.log('ev', ev);

    if (ev.target.name === 'price') this.setState({ 'priceValue': ev.target.value })
    this.props.selectFilter(ev)
  }

  onToggleActiveSize = () => {
    this.setState((prevState) => {
      if (prevState.isToggleSize === '') return this.state.isToggleSize = 'is-active'
      return this.state.isToggleSize = ''
    })
  }

  onToggleActiveGender = () => {
    this.setState((prevState) => {
      if (prevState.isToggleGender === '') return this.state.isToggleGender = 'is-active'
      return this.state.isToggleGender = ''
    })
  }

  onToggleActiveShop = () => {
    this.setState((prevState) => {
      if (prevState.isToggleShop === '') return this.state.isToggleShop = 'is-active'
      return this.state.isToggleShop = ''
    })
  }
  onToggleActivePrice = () => {
    this.setState((prevState) => {
      if (prevState.isTogglePrice === 'show') return this.state.isTogglePrice = 'hide'
      return this.state.isTogglePrice = 'show'
    })
  }



  // onSelectPriceRange = (ev) => {
  //   console.log(ev.target.value);
  //   this.props.setFilters(ev)
  // }


  // onSelectSort = (ev) => {
  //   this.props.setSorts({ [ev.target.name]: ev.target.value })
  // }

  onClearFilter = () => {
    this.props.loadItems();
  }



  render() {
    return <React.Fragment>
      <div className="filters flex justify-center" style={{}}>
        {/* sizes */}
        <div className={`checkbox-dropdown ${this.state.isToggleSize} flex align-center justify-center`} onClick={this.onToggleActiveSize} >
          <div className="">Size</div>
          <ul className="checkbox-dropdown-list" >
            <li>
              <label>
                <input type="checkbox" value="s" name="size" onChange={this.onSelectFilter} />S</label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="m" name="size" onChange={this.onSelectFilter} />M</label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="l" name="size" onChange={this.onSelectFilter} />L</label>
            </li>
          </ul>
        </div>


        {/* Gender */}
        <div className={`checkbox-dropdown ${this.state.isToggleGender} flex align-center justify-center`} onClick={this.onToggleActiveGender}>
          Gender
  <ul className="checkbox-dropdown-list" >
            <li>
              <label>
                <input type="checkbox" value="men" name="gender" onChange={this.onSelectFilter} />Men</label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="women" name="gender" onChange={this.onSelectFilter} />Women</label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="unisex" name="gender" onChange={this.onSelectFilter} />Unisex</label>
            </li>
          </ul>
        </div>

        {/* Shops */}
        <div className={`checkbox-dropdown ${this.state.isToggleShop} flex align-center justify-center`} onClick={this.onToggleActiveShop}>
          Shops
  <ul className="checkbox-dropdown-list" >
            <li>
              <label>
                <input type="checkbox" value="5e333c471c9d44000097c9f9" name="itemOwner" onChange={this.onSelectFilter} />ICON MEN</label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="5e298e5ec82c34ede14ea41a" name="itemOwner" onChange={this.onSelectFilter} />The Ground Round</label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="5e33ffcf8fe37c0bb08eac3a" name="itemOwner" onChange={this.onSelectFilter} />Moriz</label>

            </li>
          </ul>
        </div>


        {/* Price */}
        <div className={`checkbox-dropdown flex align-center justify-center`} onClick={this.onToggleActivePrice}>
          Price
  {/* <ul className="checkbox-dropdown-list" >
            <li>
              <input type="range" name="price" min="0" max="300" onChange={this.onSelectFilter}  ></input>
            </li>
          </ul> */}
        </div>

        <div className={`flex align-center justify-center ${this.state.isTogglePrice}`}>
          <div className="flex scale-in-center ">
            <input type="range" name="price" min="0" max="300" onChange={this.onSelectFilter}  ></input>
            <p className="price-filter">${this.state.priceValue}</p>
          </div>
        </div>


        <button className="flex clear-all" onClick={this.onClearFilter}>Clear All</button>


      </div>


    </React.Fragment>
  }

}
const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = {
  loadItems
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);

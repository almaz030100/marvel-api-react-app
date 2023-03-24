import './charListItem.scss';
import React, {Component} from "react";

class CharListItem extends Component {
  onKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.props.onCharSelected();
    }
  }

  focusSelectedItem = () => {
    if (this.props.currentElement) {
      return 'char__item_selected';
    }
  }

  render() {
    const {name, thumbnail} = this.props;
    let thumbnailStyles = {};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
      thumbnailStyles = {
        objectPosition: 'left'
      }
    }
    return (
      <li
        className={`char__item ${this.focusSelectedItem()}`}
        tabIndex="0"
        onClick={this.props.onCharSelected}
        onKeyDown={this.onKeyDown}
      >
        <img src={thumbnail} alt="abyss" style={thumbnailStyles}/>
        <div className="char__name">{name}</div>
      </li>
    )
  }
}

export default CharListItem;
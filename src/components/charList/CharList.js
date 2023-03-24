import './charList.scss';
import React, {Component} from "react";
import CharListItem from "../charListItem/CharListItem";
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import PropTypes from "prop-types";

class CharList extends Component {
  state = {
    chars: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charsEnded: false
  }

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChars();
  }

  onCharsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) {
      ended = true;
    }

    this.setState(({chars, offset}) => ({
      chars: [...chars, ...newChars],
      loading: false,
      error: false,
      newItemLoading: false,
      offset: offset + 9,
      charsEnded: ended
    }))
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true,
      newItemLoading: false
    })
  }

  updateChars = (offset) => {
    this.setState({
      newItemLoading: true
    })

    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharsLoaded)
      .catch(this.onError);
  }

  render() {
    const {chars, loading, error, newItemLoading, offset, charsEnded} = this.state;
    const content = () => {
      if (loading) {
        return <Spinner/>
      } else if (error) {
        return <ErrorMessage/>
      } else {
        return (
          <ul className="char__grid">
            {chars.map(item => <CharListItem
              key={item.id}
              name={item.name}
              thumbnail={item.thumbnail}
              onCharSelected={() => this.props.onCharSelected(item.id)}
              currentElement={this.props.charId === item.id}
            />)}
          </ul>
        )
      }
    }

    return (
      <div className="char__list">
        {content()}
        <button
          className="button button__main button__long button__load-more"
          disabled={newItemLoading}
          onClick={() => this.updateChars(offset)}
          style={{'display': charsEnded ? 'none' : ''}}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func
}

export default CharList;
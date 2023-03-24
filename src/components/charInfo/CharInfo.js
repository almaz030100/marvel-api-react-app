import './charInfo.scss';
import {Component} from "react";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Skeleton from "../skeleton/Skeleton";
import MarvelService from "../../services/MarvelService";
import PropTypes from "prop-types";

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false
  }

  marvelService = new MarvelService();

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  updateChar = () => {
    const {charId} = this.props;
    if (!charId) {
      return;
    }

    this.setState({
      loading: true
    });

    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  }

  onCharLoaded = (char) => {
    this.setState({
      char,
      loading: false,
      error: false
    })
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true
    })
  }

  render() {
    const {char, loading, error} = this.state;
    const content = () => {
      if (loading) {
        return <Spinner/>
      }
      if (error) {
        return <ErrorMessage/>
      }
      if (char) {
        return <View char={char}/>
      }
      return <Skeleton/>
    }

    return (
      <div className="char__info">
        {content()}
      </div>
    )
  }
}

const View = ({char}) => {
  let {name, description, thumbnail, homepage, wiki, comics} = char;
  let thumbnailStyles = {};
  if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    thumbnailStyles = {
      objectPosition: 'left'
    }
  }
  if (description === '') {
    description = 'There is no description for this character';
  }
  comics = comics.splice(0, 10);

  const noComics = () => {
    if (!comics.length) {
      return (
        <p>There are no comics about this character.</p>
      )
    } else {
      return null;
    }
  }

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name} style={thumbnailStyles}/>
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} target="_blank" rel="noreferrer" className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} target="_blank" rel="noreferrer" className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comics.map((item, i) => {
          return (
            <li key={i} className="char__comics-item">
              {item.name}
            </li>
          )
        })}
      </ul>
      {noComics()}
    </>
  )
}

CharInfo.propTypes = {
  charId: PropTypes.number
}

export default CharInfo;
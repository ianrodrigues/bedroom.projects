import AlfieCover from 'images/alfie-cover.jpg';
import CareCover from 'images/care-cover.jpg';
import GucciCover from 'images/gucci-tnf-cover.jpg';
import AW2Cover from 'images/aw2-cover.jpg';
import The1975Cover from 'images/1975-cover.jpg';

let id = 0;
function uuid() {
  return id++;
}

const mediaDb = {
  photos: [
    {
      id: uuid(),
      title: 'Alfie Templeman',
      src: AlfieCover,
    },
    {
      id: uuid(),
      title: 'Beabadoobee - Care',
      src: CareCover,
    },
    {
      id: uuid(),
      title: 'Gucci x The North Face',
      src: GucciCover,
    },
    {
      id: uuid(),
      title: 'The 1975 - Me & You Together Song BTS',
      src: The1975Cover,
    },
    {
      id: uuid(),
      title: 'PHUG Autumn/Winter 2020',
      src: AW2Cover,
    },
  ],
  videos: [
    {
      id: uuid(),
      title: 'Beabadoobee - Worth It',
      src: 'https://bedroom.sandervispoel.com/static/beabadoobee__worth_it.mov',
    },
    {
      id: uuid(),
      title: 'Raissa - GO FAST BABY',
      src: 'https://bedroom.sandervispoel.com/static/raissa__go-fast.mov',
    },
    {
      id: uuid(),
      title: 'Sports Team - Here It Comes Again',
      src: 'https://bedroom.sandervispoel.com/static/sports-team__here-it-comes-again.mov',
    },
    {
      id: uuid(),
      title: 'The 1975 - Me & You Together Song',
      src: 'https://bedroom.sandervispoel.com/static/1975__me_you_together_song.mov',
    },
    {
      id: uuid(),
      title: 'Boy Pablo - Leave Me Alone',
      src: 'https://bedroom.sandervispoel.com/static/boy_pablo__leave_me_alone.mov',
    },
    {
      id: uuid(),
      title: 'Beabadoobee Spotify Sessions',
      src: 'https://bedroom.sandervispoel.com/static/beabadoobee__spotify-sessions.mov',
    },
  ],
};

export default mediaDb;

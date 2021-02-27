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
      slug: 'alfie-templeman',
    },
    {
      id: uuid(),
      title: 'Beabadoobee - Care',
      src: CareCover,
      slug: 'beabadoobee-care',
    },
    {
      id: uuid(),
      title: 'Gucci x The North Face',
      src: GucciCover,
      slug: 'gucci-tnf',
    },
    {
      id: uuid(),
      title: 'The 1975 - Me & You Together Song BTS',
      src: The1975Cover,
      slug: '1975-bts',
    },
    {
      id: uuid(),
      title: 'PHUG Autumn/Winter 2020',
      src: AW2Cover,
      slug: 'phug-aw20',
    },
  ],
  videos: [
    {
      id: uuid(),
      title: 'Beabadoobee - Worth It',
      src: 'https://bedroom.sandervispoel.com/static/beabadoobee__worth_it.mov',
      slug: 'beabadoobee-worth-it',
    },
    {
      id: uuid(),
      title: 'Raissa - GO FAST BABY',
      src: 'https://bedroom.sandervispoel.com/static/raissa__go-fast.mov',
      slug: 'raissa-go-fast',
    },
    {
      id: uuid(),
      title: 'Sports Team - Here It Comes Again',
      src: 'https://bedroom.sandervispoel.com/static/sports-team__here-it-comes-again.mov',
      slug: 'sports-team',
    },
    {
      id: uuid(),
      title: 'The 1975 - Me & You Together Song',
      src: 'https://bedroom.sandervispoel.com/static/1975__me_you_together_song.mov',
      slug: '1975-song',
    },
    {
      id: uuid(),
      title: 'Boy Pablo - Leave Me Alone',
      src: 'https://bedroom.sandervispoel.com/static/boy_pablo__leave_me_alone.mov',
      slug: 'boy-pablo-leave',
    },
    {
      id: uuid(),
      title: 'Beabadoobee Spotify Sessions',
      src: 'https://bedroom.sandervispoel.com/static/beabadoobee__spotify-sessions.mov',
      slug: 'beabadoobee-spotify',
    },
  ],
};

export default mediaDb;

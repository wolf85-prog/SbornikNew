/**
 * Styles
 */

import { StyleSheet, Dimensions } from 'react-native'
import Colors from '@/lib/ui/styles/colors'
import Themes from '@/lib/ui/styles/themes'

const { width } = Dimensions.get('window');

const IMG_HEIGHT = 300;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
    //padding: 32,
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
  },

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  emptyListTitle: {
    color: '#7f8c8d',
    textAlign: 'center',
    fontSize: 22,
  },

    emptyList: {
    color: '#b2babb',
    textAlign: 'center',
    fontSize: 16,
  },

  listSongs:{
    marginTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    flex: 1,
  },

  back: {
    backgroundColor: '#514450'
  },

  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 58,
  },

  cardNote: {
    width: '100%',
    borderRadius: 10
  },

  number: {
    width: 60,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  numberText: {
    fontSize: 22, 
    color: '#f3f3f3'
  },

  main_content: {
    width: '70%',
    //position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },

  right_section: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },

  name: {
    color: '#f3f3f3',
    fontSize: 16, 
    fontFamily: 'SpaceMono',
  },

  category: {
    color: '#aeb6bf',
    fontFamily: 'SpaceMono'
  },

  searchBox: {
    height: 46,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    color: '#f3f3f3'
  },


    page: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    header: {
      backgroundColor: 'black',
      height: 100,
    },
    scrollStyle: {
      padding: 5,
    },
    slide: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      backgroundColor: 'white',
    },
    image: {
      width: width, 
      height: IMG_HEIGHT,
      //marginVertical: 32,
    },
    text: {
      color: 'rgba(0, 0, 0, 0.8)',
      textAlign: 'left',
    },
    title: {
      fontSize: 22,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
    },


    floatingButton: {
      position: 'absolute',
      width: 100,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      bottom: 0,
      right: 0,
    },

    floatingButtonNote: {
      backgroundColor:'#DE3163',
      borderRadius:'50%',
      position: 'absolute',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      top: 270,
      right: 90,
      zIndex: 100,
    },

    floatingButtonBemol: {
      backgroundColor:'#DE3163',
      borderRadius:'50%',
      position: 'absolute',
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      top: 280,
      right: 170,
      zIndex: 100,
    },

    floatingButtonDiez: {
      backgroundColor:'#DE3163',
      borderRadius:'50%',
      position: 'absolute',
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      top: 280,
      right: 20,
      zIndex: 100,
    },


    chordName: {
      color: 'red',
    },

    rowTone: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      width: '90%',
      marginLeft: 25,
    },

    textTone: {
      color: '#fff',
    },

    slider: {
      width: 300,
      opacity: 1,
      marginTop: 10,
    },

    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },


    // about
    titleText: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      paddingVertical: 20,
    },

    imageLogo: {
      width: 100,
      height: 100,
      marginBottom: 20
    },

    customerName: {
      fontSize: 18,
      fontWeight: 700,
      //color: '#000'
    },

    customerCount: {
      fontSize: 18,
      fontWeight: 400,
      //color: '#000'
    },

    heightView: {
      height: 500
    }, 

    bottom: {
      marginTop: 25
    },

    //accords
    containerAccords: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 0,
      paddingVertical: 20,
    },

    item: {
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 10,
    },

    textAccord: {
      fontSize: 22,
    }

})

export { Colors, Themes, styles }

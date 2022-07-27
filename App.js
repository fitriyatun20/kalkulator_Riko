import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default class App extends React.Component {
  constructor() {
    super();
  
    this.state = {
      hasil: 0,
      error: false,
      maxLengthInput: 50
    };
  }

  calcSum(text) {

    // regex number
    let numberRegex = /([\d])/;
    // regex arithmetic
    let arithmeticSignRegex = /([+*/%-])/;
    // regex number dan arithmetic
    let numAriSignRegex = /([+*/%\d-])/;
    let numAriSignRegexReverse = /([^+*/%-\d ])/;

    if (text !== '') {

      if (text.match(numAriSignRegexReverse) && text !== '') {
        // set error jika input dimasukkan karakter selain number dan arithmetic sign
        this.setState({
          error: 'Input mengandung karakter yang dilarang',
          maxLengthInput: text.length
        });
      } else {
        // variable untuk menampung pemfilteran string di perulangan pertama
        let trimmedText = '';
        // variable untuk menampung pemfilteran string di perulangan kedua
        let newText = '';

        // length + 1 agar perulangan berputar lebih banyak 1x
        // yang nantinya kelebihan perulangannya digunakan untuk prosess lain
        // yang membutuhkan hasil dari perulangan pertama ini
        for (let i = 0; i < (text.length + 1); i++) {

          if (i !== text.length) {
            // ini hanya akan berjalan sebanyak length dari text
            if (text[i] === ' ') {
              // jika spasi maka lewatkan
              // jadi spasi tidak dimasukkan ke variable trimmedText
              continue;
            }
            else {
              trimmedText += text[i];
            }
          } else {
            if (!trimmedText[0].match(numberRegex)) {
              return this.setState({
                error: 'Karakter pertama harus berupa angka',
                maxLengthInput: trimmedText.length
              });

            }

            // ini hanya akan berjalan pada perulangan terakhir yaitu kelebihan perulangan
            // yang telah dibuat dengan length + 1 diatas

            // perulangan kedua ini juga dibuat kelebihan satu
            for (let u = 0; u < (trimmedText.length + 1); u++) {
              if (u !== trimmedText.length) {
                // berjalan sebanyak length trimmedText
                if (trimmedText[u].match(numberRegex)) {

                  // proses untuk index u yang ada numbernya.
                  
                  // else if dibawah bertujuan untuk memisahkan number dan arithmetic sign
                  // dengan titik (.) yang akan dimasukkan kedalam variable newText
                  if (trimmedText[u + 1] !== undefined && trimmedText[u + 1].match(arithmeticSignRegex)) {
                    // masukkan titik jika index u + 1 adalah arithmetic sign
                    newText += trimmedText[u] + '.';
                  } else {
                    // jangan masukkan jika bukan
                    newText += trimmedText[u];
                  }
                } else {
                  // proses untuk index u yang ada arithmetic sign nya

                  // if untuk pencegahan jika inputan mengandung operator arithmetic yang berderet
                  // (ex: 4+4--)
                  if (trimmedText[u + 1] !== undefined && trimmedText[u + 1].match(arithmeticSignRegex)) {
                    return this.setState({
                      error: 'Masukkan angka setelah operator arithmetic',
                      maxLengthInput: trimmedText.length
                    });
                  } else {                    
                    this.setState({
                      error: false,
                      maxLengthInput: 50,
                    });
                  }

                  // proses dibawah sama tujuannya dengan yg di if diatas tapi ini untuk yang
                  // ada arithmetic sign nya
                  if (trimmedText[u + 1] !== undefined && trimmedText[u + 1].match(numberRegex)) {
                    // masukkan titik jika index u + 1 adalah number
                    newText += trimmedText[u] + '.';
                  } else {
                    // masukkan titik jika bukan
                    newText += trimmedText[u];
                  }
                }
              } else {

                // akan berjalan hanya pada perulangan terakhir
                // yang pada saat perulangan terakhir data yang diproses pada
                // perulangan pertama sudah selesai
                let result = (resultText, callback) => {

                  // fungsi result yang nantinya digunakan untuk proses akhir

                  if (resultText !== '' && typeof resultText === 'string') {
                    if (resultText.match(/(\.)/)) {
                      // ubah isi variable resultText menjadi array jika variable tidak kosong,
                      // tipenya string, dan mengandung titik (sebagai pemisah) yang telah diproses
                      // pada perulangan kedua
                      resultText = resultText.split('.');
                    } 
                    else {
                      // jika proses else ini berjalan berarti variable resultText tidak berisi titik
                      // jadi buat array bari dengan satu value yang ada
                      resultText = resultText.split();
                    }
                  } else {
                    // jika variable resultText kosong maka buat array kosong
                    resultText = [''];
                  }


                  if (resultText[0] !== '') {
                    if (resultText.length >= 2) {
                      if (resultText[resultText.length - 1].match(arithmeticSignRegex)) {
                        // mengecek jika value di index terakhir array resultText ada arithmetic sign nya
                        // masukkan hasil saat ini (jadi proses tidak menghitung input)
                        // karena karakter terakhir pada input bukan angka (ex: 4 + 4 +)
                        callback(this.state.hasil);
                      }
                      else if (resultText[resultText.length - 1].match(numberRegex)) {
                        // mengecek jika value di index terakhir array resultText adalah number
                        // maka gabungkan array resultText menjadi string yang akan di eval()
                        callback(eval(resultText.join('')));
                      }
                    } else {
                      // masukkan value index pertama dari array resultText
                      callback(resultText[0]);
                    }
                  } else {
                    // masukkan hasil 0 jika index pertama array resultText kosong
                    callback(0);
                  }
                };

                let insertToState = (result) => {

                  // fungsi insetToState yang nantinya akan menjadi callback fungsi result

                  this.setState({
                    error: false,
                    hasil: result,
                  });
                }

                // jalankan proses akhir
                result(newText, (res) => insertToState(res));
              }
            }
          }
        }
        this.setState({
          maxLengthInput: 50,
        });
      }
    } else {
      this.setState({
        hasil: 0,
        error: false,
        maxLengthInput: 50
      });
    }
  }

  render() {
    const { hasil, error, maxLengthInput } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}> Kalkulator </Text>
        {(error !== false && <Text style={styles.textError}> {error} </Text>)}
        <TextInput 
          style={styles.input}
          editable={false} 
          value={'Hasil: ' + String(hasil)} />
        <TextInput 
          style={ (error !== false ? styles.inputError : styles.input) } 
          maxLength={maxLengthInput} 
          onChangeText={(text) => this.calcSum(text)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'blue',
    paddingTop: 50,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  inputError: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  textError: {
    color: 'red',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 30
  }
});
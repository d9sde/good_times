// geman language file

function generate_time_string()
{
  let text = "Es ist ";
  let h = hour();
  let randomizer = hour() + day();
  switch(minute()) {
    case 0: text+= "genau um "; break;
    case 1: case 2: text+= "kurz nach "; break;
    case 3: case 4: case 5: case 6: case 7: text+= "fünf nach "; break;
    case 8: case 9: case 10: case 11: case 12: text+= "zehn nach "; break;
    case 13: case 14: if(randomizer % 2 == 0) {text+= "kurz vor viertel "; h++;} else text+= "gleich viertel nach "; break;
    case 15: if(randomizer % 2 == 0) {text+= "genau viertel "; h++;} else text+= "genau viertel nach "; break;
    case 16: case 17: if(randomizer % 2 == 0) {text+= "kurz nach viertel "; h++;} else text+= "viertel nach "; break;
    case 18: case 19: case 20: case 21: case 22: if(randomizer % 2 == 0) {text+= "zehn vor halb "; h++;} else text+= "zwanzig nach "; break;
    case 23: case 24: case 25: case 26: case 27: text+= "fünf vor halb "; h++; break;
    case 28: case 29: text+= "kurz vor halb "; h++; break;
    case 30: text+= "genau halb "; h++; break;
    case 31: case 32: text+= "kurz nach halb "; h++; break;
    case 33: case 34: case 35: case 36: case 37: text+= "fünf nach halb "; h++; break;
    case 38: case 39: case 40: case 41: case 42: text+= randomizer%2 ? "zehn nach halb " : "zwanzig vor "; h++; break;
    case 43: case 44: text+= randomizer%2 ? "kurz vor dreiviertel " : "gleich viertel vor "; h++; break;
    case 45: text+= randomizer%2 ? "genau dreiviertel " : "genau viertel vor "; h++; break;
    case 46: case 47: text+= randomizer%2 ?  "kurz nach dreiviertel " : "viertel vor "; h++; break;
    case 48: case 49: case 50: case 51: case 52: text+= "zehn vor "; h++; break;
    case 53: case 54: case 55: case 56: case 57: text+= "fünf vor "; h++; break;
    case 58: case 59: text+= "kurz vor "; h++; break;
  }

  switch(h) {
    case 0: case 12: case 24: text+= "zwölf."; break;
    case 1: case 13: text+= "eins."; break;
    case 2: case 14: text+= "zwei."; break;
    case 3: case 15: text+= "drei."; break;
    case 4: case 16: text+= "vier."; break;
    case 5: case 17: text+= "fünf."; break;
    case 6: case 18: text+= "sechs."; break;
    case 7: case 19: text+= "sieben."; break;
    case 8: case 20: text+= "acht."; break;
    case 9: case 21: text+= "neun."; break;
    case 10: case 22: text+= "zehn."; break;
    case 11: case 23: text+= "elf."; break;
  }
  return text;
}
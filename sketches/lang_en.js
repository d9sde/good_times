// english language file

function generate_time_string()
{
  let text = "It´s "; // "It\u02D9s is ";
  let h = hour();
  switch(minute()) {
    case 1: case 2: text+= "just after "; break;
    case 3: case 4: case 5: case 6: case 7: text+= "five past "; break;
    case 8: case 9: case 10: case 11: case 12: text+= "ten past "; break;
    case 13: case 14: case 15: case 16: case 17: text+= "a quarter past "; h++; break;
    case 18: case 19: case 20: case 21: case 22: text+= "twenty past "; break;
    case 23: case 24: case 25: case 26: case 27: text+= "twenty-five past "; h++; break;
    case 28: case 29: case 30: case 31: case 32: text+= "half past "; break;
    case 33: case 34: case 35: case 36: case 37: text+= "twenty-five to "; h++; break;
    case 38: case 39: case 40: case 41: case 42: text+= "twenty to "; h++; break;
    case 43: case 44: case 45: case 46: case 47: text+= "a quarter to "; h++; break;
    case 48: case 49: case 50: case 51: case 52: text+= "ten to "; h++; break;
    case 53: case 54: case 55: case 56: case 57: text+= "five to "; h++; break;
    case 58: case 59: text+= "almost "; h++; break;
  }

  switch(h) {
    case 0: case 12: case 24: text+= "twelve"; break;
    case 1: case 13: text+= "one"; break;
    case 2: case 14: text+= "two"; break;
    case 3: case 15: text+= "three"; break;
    case 4: case 16: text+= "four"; break;
    case 5: case 17: text+= "five"; break;
    case 6: case 18: text+= "six"; break;
    case 7: case 19: text+= "seven"; break;
    case 8: case 20: text+= "eight"; break;
    case 9: case 21: text+= "nine"; break;
    case 10: case 22: text+= "ten"; break;
    case 11: case 23: text+= "eleven"; break;
  }

  if(minute() < 3 || minute() > 57)
    text+= " o´clock";

  text+= ".";

  return text;
}
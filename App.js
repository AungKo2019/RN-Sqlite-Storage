import React, { useEffect, useState } from 'react';
import {View, Text , StatusBar, TextInput, Button, FlatList}from 'react-native';
import * as SQLite from 'expo-sqlite';

const db=SQLite.openDatabase("expo-sqlite");

const App=()=>{
  const [category, setCategory] = useState("");
  const [categoryget, setCategoryget] = useState([]);
  
  const createTables=()=>{
    db.transaction(txn=>{
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))`,
        [],
        (sqlTxn, res)=>{
          console.log("table create successfully");
        },
        error=>{
          console.log("error on creating table" + error.message);
        },
      );
    });
  };
  
  const addCategory = () =>{
    if(!category){
      alert('Enter category');
      return false;
    }
    db.transaction(txn=>{
      txn.executeSql(
        `INSERT INTO categories(name) VALUES(?)`,
        [category],
        (sqlTxn,res)=>{
          console.log(`${category} category added successful`);
          //getCategories();
        },
        error=>{
          console.log("error on adding category" + error.message);
        }
      )
    });
  };

  const getCategories=()=>{
    db.transaction(txn=>{
      txn.executeSql(
        `SELECT * FROM categories ORDER BY id DESC`,
        [],
        (sqlTxn,res)=>{
          console.log("Categories retrived successfully");
          let len=res.rows.length;
          if (len>0){
            let results=[];
            for (let i=0;i<len;i++){
              let item=res.rows.item(i);
              results.push({id: item.id,name:item.name});
            }
            setCategoryget(results);
          }
        },
        error=>{
          console.log("error on getting categories"+error.message);
        } 
      )
    })
  };

  const renderCategoryget=({item})=>{
    return (
      <View style={{flexDirection:'row', paddingVertical:12,paddingHorizontal:1,
      borderBottomWidth:1,borderColor:"#ddd"}}>
        <Text style={{marginRight:9}}>{item.id}</Text>
        <Text>{item.name}</Text>
      </View>
    )
  }

  useEffect(() => {
     createTables();
    //  getCategories();
  }, []);
  

  return (
    <View>
      <StatusBar backgroundColor="orange"/>
      <TextInput
        placeholder="Enter category"
        value={category}
        onChangeText={setCategory}
        style={{marginHorizontal:8}}
      />

      <Button title="Submit" onPress={addCategory}/>

      {/* <FlatList data={categoryget} renderItem={renderCategoryget}/> */}
    </View>
  )
}

export default App;

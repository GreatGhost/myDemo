function getUserTag(data){
    data=data||[];
    let user={};
    let tags=[{tag:'个人认证',type:'1',class:'tag1'},{tag:'企业认证',type:'2',class:'tag2'},{tag:'个体户认证',type:'3',class:'tag3'},{tag:'未认证',type:'0',class:'tag4'}];
    data.forEach(tmp=>{
      let aud_type_str=tags.find(tag=>tag.type===tmp.aud_type).tag;
      let user_name=tmp.user_name;
      let head_pic = (tmp.head_pic && tmp.head_pic.length) ? tmp.head_pic : '/resource/mine-head-pic.png'; 
      Object.assign(user,{head_pic,user_name,aud_type_str});
      tmp['user']=JSON.parse(JSON.stringify(user));
    })
    return data;
  }

  module.exports={
      getUserTag:getUserTag
  }
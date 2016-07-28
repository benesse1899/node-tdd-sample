import FacebookHelper from '../../../src/facebook/helper.js'
import task1_initModel from '../../../src/database/task1';

describe.only('facebook-helper', () => {
  let facebookHelper = null;
  let models = null;
  let friends = null;
  let t = null;
  

  before(async (done) => {
    let userId = "556732901096680";
    let token = "EAACEdEose0cBAD2CRsMLVQNFUN0mCbOkrwJDC25F9ylBEZCPKZBj0NuuLRpF82MI03AjQg4cPdBC3l3ZBkBmMvdPz2Pv4MZAksghZAtv5p2NDfgloUX3L7dt7OjDuthG9vzG7yRZA9i8fxxXfoC5MT4W7WlAxoz7amLV0imIxRFoHFy2WVGukq7wt1KZAbQgFSCDiji6k56SgZDZD";
    models = await task1_initModel();
    facebookHelper = await new FacebookHelper({userId, token});
    done();
  });

  it("get friends list", async (done) => 
  {
    try 
    {
      friends = await facebookHelper.getFriends();
      let l = friends.length;
      var i;
      for (i = 0; i < l; i++)
      {
        await models.Friend.create
        (
          {
            name: friends[i].name,
            fbid: friends[i].id,
            email: 'asd@gmail.com'
          }
        );
      }
      t = await models.Friend.findAll();
      console.log(t[0].name , t[0].fbid , t[0].email);
      done();
    } 
    catch (e) 
    {
      done(e);
    }
  });
  it("get all friends", async (done) => 
  {
      try
      {
        t = await models.Friend.findAll();
        t.length.should.be.equal(friends.length);
        done();
      }
      catch(e)
      {
        done(e);
      }
    });
    it("update email", async (done) => 
    {
      try
      {
        let t2 = friends[1].id;
        let data = await models.Friend.findOne( {where: { fbid: t2 } } );
        data.email = 'hellojs@trunk.studio';
        let result = await data.save();
        console.log(result.name , result.id , result.email);
        result.email.should.equal('hellojs@trunk.studio');
        done();
      }
      catch(e)
      {
        done(e);
      }
    });

    it("delete friend", async (done) => 
    {
      try{
        let del = await models.Friend.findOne
        (
          {
            where:{email:'hellojs@trunk.studio'}
          }
        );
        await del.destroy();

        let result = await models.Friend.findOne
        (
          {
            where:{email:'hellojs@turnk.studio'}
          }
        );

        (result === null ).should.be.true;

        done();
      }
      catch(e)
      {
        done(e);
      }
    });
});
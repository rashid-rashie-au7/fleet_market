let Prdt = require('../model/prdtmodel');

let prdtcontroller ={}

prdtcontroller.productlist = async(req,res,next)=>{
    let prdts = await Prdt.find()
    res.render('seller',{prdts:prdts})  

}

prdtcontroller.create = async(req,res,next)=>{
    res.render('product')
}
prdtcontroller.createProduct = async(req,res,next)=>{

    const prdts = await Prdt.find().sort({prdtid:-1})
    let strid
    if(prdts.length == 0){
         strid = "PRDT001"        
    }else{
        let id = (Number(prdts[0].prdtid.slice(4,7))+1).toString()
        let trg_len = 4-id.length
        let uid = id.padStart(trg_len, 0)
        strid = "PRDT"+uid
    }

    const data = new Prdt({ 
        prdtid: strid,
        prdtname: (req.body.prdtname).charAt(0).toUpperCase() + (req.body.prdtname).slice(1),
        descn: (req.body.des).charAt(0).toUpperCase() + (req.body.descn).slice(1),
        price : req.body.price,
        offer: req.body.offer,
        catgy: req.body.cat,
        qty : req.body.qty,
        expdate: req.body.expdate,
        imgpath: req.body.image
    })
    try {
        await data.save()
        res.redirect(req.get('referer'));
    } catch (error) {
        console.log("Error")
        res.send(error)
    }
};
prdtcontroller.update = async(req,res,next)=>{
    let id = req.query.id 
    console.log("id====",id)
    let prdts = await Prdt.findOne({prdtid: id})
    console.log("prdts====",prdts)
    if(prdts.length != 0){
        console.log("inside if",id)
        res.render('prdtUpdate',{prdts:prdts})
        
    }else{
        res.render('seller')
    }   
}
prdtcontroller.updateProduct = async(req,res,next)=>{
   let id = req.query.id 
   console.log("id in prdt update", id)
   let data = await Prdt.update({prdtid: id},{
        prdtname: (req.body.prdtname).charAt(0).toUpperCase() + (req.body.prdtname).slice(1),
        descn: (req.body.des).charAt(0).toUpperCase() + (req.body.descn).slice(1),
        price : req.body.price,
        offer: req.body.offer,
        catgy: req.body.cat,
        qty : req.body.qty,
        expdate: req.body.expdate,
        imgpath: req.body.image
   }, {new : true})
   console.log(data," updateeee ")
   res.redirect('/seller')
}

prdtcontroller.delete = async(req,res,next)=>{
    let id = req.query.id 
    let prdts = await Prdt.deleteOne({prdtid: id})
    res.redirect('/seller')
}

module.exports = prdtcontroller;
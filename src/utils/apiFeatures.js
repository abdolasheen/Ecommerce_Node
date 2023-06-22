class ApiFeatures {
// filter - sort - paginate- search-select
    constructor(mongooseQuery,queryData){
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData // req.query
    }
    paginate(){
        let {page,size}= this.queryData;
        if(!page || page<=0){
            page =1
        }
        if(!size || size <=0){
            size =3
        }
        this.mongooseQuery.limit(parseInt(size)).skip((parseInt(page) -1)*parseInt(size))
        return this
    }
    filter(){
        //delete this keys from query params
        const excludeQueryParams = ['page','size','sort','search','fields'];
        //destruct queryData from req.query
        const filterQuery = {...this.queryData};
        //delete unneeded keys
        excludeQueryParams.forEach(param => delete filterQuery[param]);
        //replace every filter data with $[filterData]
       
        this.mongooseQuery.find(JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g, match =>`$${match}`)));
        // console.log(this.mongooseQuery)
        return this;
    }
    sort(){
        if(this.queryData.sort){
            this.mongooseQuery.sort(this.queryData.sort.replaceAll(",",' '));
        }
        return this

        
        
    }
    // search(){
    //     if(this.queryData.search){
    //         this.mongooseQuery.sort(this.queryData.search.replaceAll(",",' '));
    //     }
    //     return this
    // }
    
    search(){
        
        this.mongooseQuery.find({
            $or:[{name:{$regex :this.queryData.search ,$options :"i" }},{description:{$regex:this.queryData.search,$options:'i'}}]
        })
        return this
    }
    select(){
        if(this.queryData.fields){
            this.mongooseQuery.select(this.queryData.fields.replaceAll(",",' '));
        }
        return this
    }
}

export default ApiFeatures;
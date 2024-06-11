export default function Provider({ name, address, description, imageCid, price, availability}) {

    const ipfsGatewayPort = 48084;

    return (
        <div className="provider-container">
            {/* <div className="left-side"> */}
                <h2>{name}</h2>
                <div className="address">{address}</div>
                <p>{description}</p>
                <img className="provider-image" alt="" src={`http://localhost:${ipfsGatewayPort}/ipfs/${imageCid}`}/>
                <div className="info-action">
                    <div style={{display: "flex", flexDirection:"column"}}>
                        <span className="availability">{availability} WCU available</span>
                        <span className="price">{price} ETH / WCU</span>
                    </div>
                    <form style={{display: "flex", flexDirection:"row", gap: "15px"}}>
                        <label htmlFor="quantity"></label>
                        <input type="text" id="quantity" name="quantity"></input>
                        <input type="submit" id="submit-btn" value="Buy now"/>
                    </form>
                </div>
            {/* </div> */}
            {/* <div className="right-side"> */}
            {/* </div> */}
        </div>
    )
}


export default function Provider({ name, description, image, availability, price}) {
    return (
        <div className="provider-container">
            <div className="left-side">
                <h2>{name}</h2>
                <p>{description}</p>
                <div className="info-action">
                    <div style={{display: "flex", flexDirection:"column"}}>
                        <span className="availability">{availability} WCU available</span>
                        <span className="price">{price} ETH / WCU</span>
                    </div>
                    <div>
                        <button>Buy now</button>
                    </div>
                </div>
            </div>
            <div className="right-side">
                <img className="provider-image" alt="" src={image}/>
            </div>
        </div>
    )
}